import React from 'react';
import { connect } from 'dva';
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
let apk_url = '';

const Index = ({ dispatch, home }) => {
  // const onFinish = (values: any) => {
  //   console.log('Received values of form: ', values);
  //   dispatch({
  //     type: 'home/uploadAPK',
  //     payload: {
  //       ...values,
  //       apk_url,
  //     },
  //   });
  // };
  function onFinish(values: any) {
    console.log('Received values of form: ', values);
    dispatch({
      type: 'home/uploadAPK',
      payload: {
        ...values,
        apk_url,
      },
    });
  }
  // function onFinish(values: any) {
  //   console.log('Received values of form: ', values);
  //   dispatch({
  //     type: 'home/uploadAPK',
  //     payload: {
  //       ...values,
  //       apk_url,
  //     },
  //   });
  // }
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
        apk_url = info.file.response.url;
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



  return (
    <div>
      <h1 className={styles.title}>文件上传</h1>
      <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
        <Form.Item
          label="版本号"
          name="version"
          rules={[{ required: true, message: '请输入版本号!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="更新内容"
          name="update_message"
          rules={[{ required: true, message: '请输入更新的内容!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="安装包"
          // name="apk_url"
          // rules={[{ required: true, message: '请上传安装包!' }]}
        >
          <Form.Item
            name="apk_url"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
            {/* {getFieldDecorator('image_id', {
              valuePropName: 'imageList',
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: '请上传图片!' }],
            })(
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  点击或拖拽文件到此区域进行上传
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>,
            )} */}
          </Form.Item>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ home }) => ({
  home,
}))(Index);
