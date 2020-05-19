import React from 'react';
import styles from './index.less';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  message,
  Input,
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const { Option } = Select;

class Index extends React.Component {
  handleClick = () => {
    window.open('https://localhost:3001/download/app-release-1.0.0.apk');
  };
  render() {
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
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const normFile = (e: { fileList: any }) => {
      console.log('Upload event:', e);

      if (Array.isArray(e)) {
        return e;
      }

      return e && e.fileList;
    };

    const onFinish = (values: any) => {
      console.log('Received values of form: ', values);
    };
    return (
      <div>
        <h1 className={styles.title}>文件上传</h1>
        <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Dragger">
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Index;
