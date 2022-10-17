import { combinedReducers } from "redux";
import dashboardReducer from "./reducers/dashboardReducer";

export default combinedReducers({
  dashboard: dashboardReducer,
});
