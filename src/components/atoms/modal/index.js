import { PlusOutlined } from "@ant-design/icons";
import {  Modal as BaseModal } from "antd";
import { useState } from "react";
import styles from './modal.module.css'


const Modal = ({ open, setOpen, uploadProfile, setUploadImage }) => {

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    await uploadProfile();

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <BaseModal
        title="Profile"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <label className={styles.uploadWrapper}>
        <PlusOutlined style={{ fontSize: "50px", color: "#555" }} />
        Upload A Profile Image
          <input
          className={styles.upload}
            type="file"
            onChange={(e) => setUploadImage(e.target.files[0])}
          />
        </label>
      </BaseModal>
    </>
  );
};
export default Modal;
