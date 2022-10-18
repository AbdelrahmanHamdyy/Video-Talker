import { setLocalStream } from "../../store/actions/callActions";
import store from "../../store/store";

const defaultConstraints = {
  video: true,
  audio: true,
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
    })
    .catch((err) => {
      // Permission Denied
      console.log("Error occured when trying to access the local stream");
      console.log(err);
    });
};
