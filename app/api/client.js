import { create } from "apisauce";
import authStorage from "../components/utils/authStorage";

const apiClient = create({
  // baseURL: 'http://localhost:8000/api/v1',
  // baseURL: "https://vetinstantbe.azurewebsites.net/api/v1",
  // baseURL: 'http://192.168.43.242:8000/api/v1',
  baseURL:
    "http://ec2-13-126-97-116.ap-south-1.compute.amazonaws.com:8000/api/v1",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] = `Bearer ${authToken}`;
});

export default apiClient;
