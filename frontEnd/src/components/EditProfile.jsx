import React, { useEffect, useMemo, useRef, useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const DEFAULT_AVATAR =
  "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";
const PREVIEW_SIZE = 320;
const EXPORT_SIZE = 420;
const MAX_IMAGE_DATA_URL_LENGTH = 1_200_000;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || DEFAULT_AVATAR);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const [editorImageSrc, setEditorImageSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const editorCanvasRef = useRef(null);
  const editorImageRef = useRef(null);
  const imageSizeRef = useRef({ width: 1, height: 1 });

  const hasEditorImage = Boolean(editorImageSrc);
  const displayedPhoto = useMemo(
    () => photoUrl || DEFAULT_AVATAR,
    [photoUrl]
  );

  const getBounds = (currentZoom = zoom) => {
    const imgW = imageSizeRef.current.width;
    const imgH = imageSizeRef.current.height;
    const scale = Math.max(PREVIEW_SIZE / imgW, PREVIEW_SIZE / imgH) * currentZoom;
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const limitX = Math.max(0, (drawW - PREVIEW_SIZE) / 2);
    const limitY = Math.max(0, (drawH - PREVIEW_SIZE) / 2);
    return { limitX, limitY, scale };
  };

  const drawEditor = () => {
    const canvas = editorCanvasRef.current;
    const image = editorImageRef.current;
    if (!canvas || !image) return;

    const context = canvas.getContext("2d");
    const { scale } = getBounds();
    const drawW = imageSizeRef.current.width * scale;
    const drawH = imageSizeRef.current.height * scale;
    const x = (PREVIEW_SIZE - drawW) / 2 + pan.x;
    const y = (PREVIEW_SIZE - drawH) / 2 + pan.y;

    context.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    context.fillStyle = "#0f0f15";
    context.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    context.drawImage(image, x, y, drawW, drawH);
  };

  useEffect(() => {
    drawEditor();
  }, [zoom, pan, editorImageSrc]);

  const openEditorFromSource = (source) => {
    const image = new Image();
    image.onload = () => {
      editorImageRef.current = image;
      imageSizeRef.current = { width: image.width, height: image.height };
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setEditorImageSrc(source);
    };
    image.src = source;
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeMb = 8;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError("Please upload an image smaller than 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      openEditorFromSource(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleEditCurrentPhoto = () => {
    if (!photoUrl) return;
    openEditorFromSource(photoUrl);
    setError("");
  };

  const handleZoomChange = (value) => {
    const nextZoom = Number(value);
    const { limitX, limitY } = getBounds(nextZoom);
    setZoom(nextZoom);
    setPan((previous) => ({
      x: clamp(previous.x, -limitX, limitX),
      y: clamp(previous.y, -limitY, limitY),
    }));
  };

  const onDragStart = (event) => {
    if (!hasEditorImage) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDragMove = (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;
    const { limitX, limitY } = getBounds();
    setPan({
      x: clamp(dragStartRef.current.panX + deltaX, -limitX, limitX),
      y: clamp(dragStartRef.current.panY + deltaY, -limitY, limitY),
    });
  };

  const onDragEnd = (event) => {
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const createExportCanvas = () => {
    if (!editorImageRef.current) return;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = EXPORT_SIZE;
    exportCanvas.height = EXPORT_SIZE;
    const ctx = exportCanvas.getContext("2d");

    const { scale } = getBounds();
    const drawW = imageSizeRef.current.width * scale;
    const drawH = imageSizeRef.current.height * scale;
    const x = (PREVIEW_SIZE - drawW) / 2 + pan.x;
    const y = (PREVIEW_SIZE - drawH) / 2 + pan.y;

    const ratio = EXPORT_SIZE / PREVIEW_SIZE;
    ctx.fillStyle = "#0f0f15";
    ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
    ctx.drawImage(
      editorImageRef.current,
      x * ratio,
      y * ratio,
      drawW * ratio,
      drawH * ratio
    );

    return exportCanvas;
  };

  const canvasToBlob = (canvas, quality = 0.86) =>
    new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
    });

  const createCroppedDataUrl = () => {
    const exportCanvas = createExportCanvas();
    if (!exportCanvas) return "";

    let quality = 0.86;
    let finalDataUrl = exportCanvas.toDataURL("image/jpeg", quality);
    while (finalDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH && quality > 0.45) {
      quality -= 0.08;
      finalDataUrl = exportCanvas.toDataURL("image/jpeg", quality);
    }

    return finalDataUrl;
  };

  const createCroppedBlob = async () => {
    const exportCanvas = createExportCanvas();
    if (!exportCanvas) return null;

    let quality = 0.86;
    let blob = await canvasToBlob(exportCanvas, quality);

    while (blob && blob.size > 900 * 1024 && quality > 0.45) {
      quality -= 0.08;
      blob = await canvasToBlob(exportCanvas, quality);
    }

    return blob;
  };

  const uploadPhotoToCloudinary = async (photoBlob) => {
    if (!photoBlob) return "";
    const formData = new FormData();
    formData.append("photo", photoBlob, "profile-photo.jpg");

    const response = await axios.post(`${BASE_URL}/upload/profile-photo`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data?.photoUrl || "";
  };

  const applyEditedImage = () => {
    const finalDataUrl = createCroppedDataUrl();
    if (!finalDataUrl) return;
    setPhotoUrl(finalDataUrl);
    setEditorImageSrc("");
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const saveProfile = async () => {
    if (!age || !gender) {
      setError("Age and Gender are required fields");
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setError("Please enter a valid age between 18 and 100");
      return;
    }
    try {
      setError("");
      let finalPhotoUrl = photoUrl;

      if (hasEditorImage && editorImageRef.current) {
        const croppedBlob = await createCroppedBlob();
        if (!croppedBlob) {
          setError("Could not process image. Please try uploading again.");
          return;
        }
        const uploadedUrl = await uploadPhotoToCloudinary(croppedBlob);
        if (!uploadedUrl) {
          setError("Could not upload image. Please try again.");
          return;
        }
        finalPhotoUrl = uploadedUrl;
      } else if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(photoUrl || "")) {
        // Backward compatibility: if previous unsaved data-url exists, upload it first.
        const dataResponse = await fetch(photoUrl);
        const dataBlob = await dataResponse.blob();
        const uploadedUrl = await uploadPhotoToCloudinary(dataBlob);
        if (!uploadedUrl) {
          setError("Could not upload image. Please try again.");
          return;
        }
        finalPhotoUrl = uploadedUrl;
      }

      if (!finalPhotoUrl) {
        setError("Could not process image. Please try uploading again.");
        return;
      }

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age: ageNum,
          gender,
          photoUrl: finalPhotoUrl,
          about,
        },
        {
          withCredentials: true,
        }
      );
      setPhotoUrl(finalPhotoUrl);
      if (hasEditorImage) {
        setEditorImageSrc("");
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (saveError) {
      const apiError = saveError?.response?.data;
      if (typeof apiError === "string") {
        setError(apiError);
      } else {
        setError(apiError?.message || "Failed to update profile");
      }
    }
  };

  return (
    <div className="space-y-6 pb-4">
      {showtoast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert rounded-full border-0 bg-success px-6 text-white shadow-lg">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}

      <section className="premium-card p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-base-content/45">
          Profile studio
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">
          Refine how you show up.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/68 sm:text-lg">
          Upload a photo, frame it the way you want, then save your profile.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="premium-card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">Edit details</h2>
            <p className="mt-2 text-sm leading-6 text-base-content/80">
              Upload and crop your profile image, then complete the rest of your info.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-base-content/85">
                  First name
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input field-control h-14 rounded-2xl px-4"
                  placeholder="Enter your first name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-base-content/85">
                  Last name
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input field-control h-14 rounded-2xl px-4"
                  placeholder="Enter your last name"
                />
              </label>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/40 bg-white/30 p-4">
              <p className="text-sm font-semibold text-base-content/90">Profile photo</p>
              <div className="flex flex-wrap gap-3">
                <label className="btn h-11 min-h-11 rounded-full border-none bg-gradient-to-r from-primary to-secondary px-5 text-white">
                  Upload image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleEditCurrentPhoto}
                  className="btn soft-surface h-11 min-h-11 rounded-full px-5 text-base-content"
                >
                  Edit current
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoUrl(DEFAULT_AVATAR)}
                  className="btn soft-surface h-11 min-h-11 rounded-full px-5 text-base-content"
                >
                  Use default
                </button>
              </div>
              <p className="text-xs text-base-content/70">
                Supported: JPG, PNG, WEBP. You can zoom and reposition before saving.
              </p>
            </div>

            {hasEditorImage && (
              <div className="space-y-4 rounded-2xl border border-white/40 bg-white/25 p-4">
                <p className="text-sm font-semibold">Image editor</p>
                <div className="mx-auto w-fit">
                  <canvas
                    ref={editorCanvasRef}
                    width={PREVIEW_SIZE}
                    height={PREVIEW_SIZE}
                    className={`rounded-2xl border border-white/45 shadow-md ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    onPointerDown={onDragStart}
                    onPointerMove={onDragMove}
                    onPointerUp={onDragEnd}
                    onPointerLeave={onDragEnd}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.22em] text-base-content/70">
                    Zoom
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(event) => handleZoomChange(event.target.value)}
                    className="range range-primary"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn h-11 min-h-11 rounded-full border-none bg-gradient-to-r from-primary to-secondary px-5 text-white"
                    onClick={applyEditedImage}
                  >
                    Apply photo
                  </button>
                  <button
                    type="button"
                    className="btn soft-surface h-11 min-h-11 rounded-full px-5 text-base-content"
                    onClick={() => {
                      setEditorImageSrc("");
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-base-content/85">
                  Age
                </span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`input field-control h-14 rounded-2xl px-4 ${
                    !age ? "input-error" : ""
                  }`}
                  placeholder="25"
                  min="18"
                  max="100"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-base-content/85">
                  Gender
                </span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`select field-control h-14 rounded-2xl px-4 ${
                    !gender ? "select-error" : ""
                  }`}
                  required
                >
                  <option disabled value="">
                    Select...
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-base-content/85">
                About
              </span>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="textarea field-control min-h-36 rounded-[24px] px-4 py-3"
                placeholder="Tell people what you build, what excites you, and what kind of connection you're looking for."
                rows={5}
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <button
              className="btn h-14 min-h-14 w-full rounded-2xl border-none bg-gradient-to-r from-primary to-secondary text-base font-semibold text-white shadow-lg shadow-primary/20"
              onClick={saveProfile}
              disabled={!age || !gender}
            >
              Save profile
            </button>
          </form>
        </section>

        <section className="premium-card p-6 sm:p-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-base-content/45">
                Live preview
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                See your profile card update in real time.
              </h2>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[380px]">
              <UserCard
                user={{ firstName, lastName, age, gender, photoUrl: displayedPhoto, about }}
                preview={true}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProfile;
