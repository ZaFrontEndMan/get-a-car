import axiosInstance from "../../utils/axiosInstance";

// Get users by vendor owner
export const getUsersByVendorOwner = async () => {
  const { data } = await axiosInstance.get(
    "/Vendor/Employee/GetUsersByVendorOwner"
  );
  return data;
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const { data } = await axiosInstance.get(
    `/Vendor/Employee/GetUserById/${userId}`
  );
  return data;
};

// Get employee statistics
export const getEmployeeStatistics = async () => {
  const { data } = await axiosInstance.get(
    "/Vendor/Employee/GetEmployeeStatistics"
  );
  return data;
};

// Update employee availability
export const updateEmployeeAvailability = async (
  employeeId: string,
  availabilityData: any
) => {
  const { data } = await axiosInstance.put(
    `/Vendor/Employee/employees/${employeeId}/availability`,
    availabilityData
  );
  return data;
};

// Update employee
export const updateEmployee = async (employeeId: string, employeeData: any) => {
  const { data } = await axiosInstance.put(
    `/Vendor/Employee/UpdateEmployee/${employeeId}`,
    employeeData
  );
  return data;
};
export const createEmployee = async (employeeData: any) => {
  return await axiosInstance.post("/Vendor/Auth/CreateEmployee", employeeData);
};
export const deleteEmployee = async (employeeId) => {
  await axiosInstance.delete(`/Vendor/Auth/DeleteEmployee/${employeeId}`);
  throw new Error("deleteEmployee API not implemented");
};
