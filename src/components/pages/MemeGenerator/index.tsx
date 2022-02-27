import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import { Content } from "antd/lib/layout/layout";
import {
  ScissorOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import UploadButton from "../../layout/UploadButton";
import {
  Alert,
  Button,
  Checkbox,
  Image,
  Input,
  message,
  Space,
  Upload,
} from "antd";
import "./MemeGenerator.scss";
import "react-image-crop/src/ReactCrop.scss";
import TemplateModal from "../../layout/TemplateModal";
import Notification from "../../layout/Notification";

interface CropType {
  unit: string;
  width: number;
  height: number;
  x: number;
  y: number;
}
const MemeGenerator = () => {
  const [src, setfile] = useState(null);
  const [inputImage, setinputImage] = useState<HTMLImageElement>();
  const [crop, setCrop] = useState<CropType>(); //   { aspect: 16 / 9 }
  const [wantcrop, setwantcrop] = useState(false);
  const [error, seterror] = useState("");
  const [visible, setvisible] = useState(false);
  const handleFileChange = (e: any) => {
    // setinputImage(e);
    //@ts-ignore
    setfile(URL.createObjectURL(e.target.files[0]));
  };

  const getCroppedImg = () => {
    if (inputImage == null || crop == undefined) return;

    const canvas = document.createElement("canvas");
    const scaleX = inputImage.naturalWidth / inputImage.width;
    const scaleY = inputImage.naturalHeight / inputImage.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    // canvas.setAttribute()
    // canvas.setAttribute("crossorigin", "anonymous");
    const ctx = canvas.getContext("2d");
    if (canvas.width === 0 || canvas.height === 0) {
      // seterror("Select Area to crop");
      Notification({ message: "Select Area to crop" });
      return;
    } else {
      seterror("");
    }
    if (ctx == null) return;
    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      inputImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    try {
      const base64Image = canvas.toDataURL("image/jpeg");
      //@ts-ignore
      setfile(base64Image);
    } catch (error) {
      Notification({ message: "Not able to crop" });
    }

    setwantcrop(!wantcrop);
  };
  const hideModal = () => {
    setvisible(false);
  };
  const onChangeHandler = (item: any) => {
    fetch(item.url)
      .then((res) => res.blob())
      .then((blob) => {
        //@ts-ignore
        setfile(URL.createObjectURL(blob));
      });
    setvisible(false);
  };
  return (
    <Content className="memegenerator__container">
      {visible ? (
        <TemplateModal
          visible={visible}
          onCancel={hideModal}
          onDataChange={onChangeHandler}
        />
      ) : (
        <></>
      )}

      <div className="memegenerator__container-box memegenerator__container-box-left">
        {src && wantcrop ? (
          <ReactCrop
            src={src}
            onImageLoaded={setinputImage}
            crop={crop}
            onChange={setCrop}
          />
        ) : src ? (
          <Image preview={false} src={src} crossOrigin="anonymous" />
        ) : (
          <></>
        )}
      </div>
      <div className="memegenerator__container-box memegenerator__container-box-right">
        {/* {error ? (
          <Alert
            type="error"
            message={error}
            closable
            onClose={() => seterror("")}
          />
        ) : (
          <></>
        )} */}

        <div className="memegenerator__container-box-right-btnholder">
          <UploadButton
            handleFileChange={handleFileChange}
            name="Upload file"
            id="browser_input"
          />
          <Button
            className="custom-file-input"
            type="dashed"
            danger
            icon={<UploadOutlined />}
            onClick={() => setvisible(true)}
          >
            {" "}
            Upload new template{" "}
          </Button>
        </div>

        <Checkbox
          onChange={(e) => setwantcrop(!wantcrop)}
          checked={wantcrop === true ? true : false}
          disabled={src === null ? true : false}
        >
          Crop
        </Checkbox>
        {wantcrop ? (
          <Button
            type="dashed"
            shape="round"
            danger
            icon={<ScissorOutlined />}
            onClick={getCroppedImg}
          >
            Crop
          </Button>
        ) : (
          <></>
        )}
      </div>
    </Content>
  );
};

export default MemeGenerator;
