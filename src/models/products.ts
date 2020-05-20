export default {
  namespace: 'products',
  state: [
    { key: '1', name: 'dva', id: 'dva' },
    { key: '2', name: 'antd', id: 'antd' },
  ],
  reducers: {
    delete(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};
