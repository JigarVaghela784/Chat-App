import { Button, Drawer as BaseDrawer } from 'antd';
import { useState } from 'react';
const DropDown = () => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
  return (
    <>
    <Button type="primary" onClick={showDrawer}>
      Open
    </Button>
    <BaseDrawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </BaseDrawer>
  </>

  )
}

export default DropDown