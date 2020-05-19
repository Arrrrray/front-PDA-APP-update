import React from 'react';
import styles from './index.less';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const props = {
  name: 'file',
  action: 'http://localhost:3001/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info: { file: { status: string; name: any }; fileList: any }) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class Index extends React.Component {
  handleClick = () => {
    window.open('https://localhost:3001/download/app-release-1.0.0.apk');
  };
  render() {
    return (
      <div>
        <h1 className={styles.title}>文件上传</h1>
        <Upload {...props}>
          <Button>
            <UploadOutlined /> 上传
          </Button>
        </Upload>
        <div>
          <Button type="primary" onClick={this.handleClick}>
            下载
          </Button>
        </div>
      </div>
    );
  }
}

export default Index;
