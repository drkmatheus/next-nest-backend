import { uploadImageAction } from "@/actions/upload/upload-image-action";
import { Button } from "@/components/Button";
import { MAX_IMG_SIZE } from "@/lib/post/constants";
import { LoaderPinwheelIcon, UploadIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";

type ImageUploaderProps = {
  disabled?: boolean;
};

export function ImageUploader({ disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();
  const [imgUrl, setImgUrl] = useState("");

  function handleChooseFile() {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  function handleChange() {
    toast.dismiss();

    if (!fileInputRef.current) {
      setImgUrl("");
      return;
    }

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      setImgUrl("");
      return;
    }

    const uploadMaxSize =
      Number(process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE) || 921600;

    if (file.size > uploadMaxSize) {
      toast.error("Imagem muito grande. Escolha uma imagem menor que 900KB.");

      fileInput.value = "";
      setImgUrl("");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadImageAction(formData);

      if (result.error) {
        toast.error(result.error);
        fileInput.value = "";
        setImgUrl("");
        return;
      }

      setImgUrl(result.url);
      toast.success("Imagem anexada");
    });

    fileInput.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        onClick={handleChooseFile}
        disabled={isUploading || disabled}
      >
        {!isUploading ? (
          <UploadIcon />
        ) : (
          <LoaderPinwheelIcon className="animate-spin" />
        )}
        Selecione uma imagem
      </Button>

      {!!imgUrl && (
        <div className=" flex flex-col gap-4">
          <p>
            <b>URL:</b> {imgUrl}
          </p>
          <img className="rounded-lg" src={imgUrl}></img>
        </div>
      )}
      <input
        ref={fileInputRef}
        className="hidden"
        name="file"
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isUploading || disabled}
      />
    </div>
  );
}
