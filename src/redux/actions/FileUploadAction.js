import {
  SET_UPLOAD_PROGRESS,
  SUCCESS_UPLOAD_FILE,
  FAILURE_UPLOAD_FILE,
} from '../types';
import APIServices from '../../services/APIServices';

export const setUploadProgress = (id, progress) => ({
  type: SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
});

export const successUploadFile = id => ({
  type: SUCCESS_UPLOAD_FILE,
  payload: id,
});

export const failureUploadFile = id => ({
  type: FAILURE_UPLOAD_FILE,
  payload: id,
});

export const uploadFile = (file, selectedProjectID) => {
  return dispatch => {
    APIServices.uploadFileData(file, selectedProjectID, dispatch)
      .then(response => {
        if (response.message == 'success') {
          dispatch(successUploadFile(file[0].uri));
        } else {
          dispatch(failureUploadFile(file[0].uri));
        }
      })
      .catch(error => {
        dispatch(failureUploadFile(file[0].uri));
      });
  };
};

// export const uploadFile = files => dispatch => {
//   if (files.length) {
//     files.forEach(async file => {
//       const formPayload = new FormData();
//       formPayload.append('file', file.file);
//       try {
//         await axios({
//           baseURL: 'http://localhost:5000',
//           url: '/file',
//           method: 'post',
//           data: formPayload,
//           onUploadProgress: progress => {
//             const {loaded, total} = progress;
//             const percentageProgress = Math.floor((loaded / total) * 100);
//             dispatch(setUploadProgress(file.id, percentageProgress));
//           },
//         });
//         dispatch(successUploadFile(file.id));
//       } catch (error) {
//         dispatch(failureUploadFile(file.id));
//       }
//     });
//   }
// };
