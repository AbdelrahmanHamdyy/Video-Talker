import { configureStore } from "redux";
import mainReducer from "./reducer";

const store = configureStore(mainReducer);

export default store;
