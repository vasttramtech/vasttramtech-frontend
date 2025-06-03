// src/state/fetchDataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Utility function to make API requests
export const fetchDataFromAPI = async (url, token) => {
  if (!token) return [];
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}${url}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data?.data || []; // Return empty array if no data
  } catch (error) {
    console.error(`API Error (${url}):`, error.response?.data || error.message);
    return []; // Return empty array on error
  }
};

// ✅ API call thunk for fetching design groups
export const fetchDesignGroups = createAsyncThunk(
  "data/fetchDesignGroups",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI(
        "/api/design-master-groups?populate=*",
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchColor = createAsyncThunk(
  "data/fetchColor",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI("/api/colors?populate=*", token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchCustomers = createAsyncThunk(
  "data/fetchCustomers",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI("/api/customer-masters?populate=*", token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchDesignMasters = createAsyncThunk(
  "data/fetchDesignMasters",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI("/api/design-masters?populate=*", token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchDesignMasterGroups = createAsyncThunk(
  "data/fetchDesignMasterGroups",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI(
        "/api/design-master-groups?populate=*",
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchUnits = createAsyncThunk(
  "data/fetchUnits",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI("/api/units?populate=*", token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchSfgmGroups = createAsyncThunk(
  "data/fetchSfgmGroups",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI("/api/sfgm-groups?populate=*", token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchRawMaterialGroups = createAsyncThunk(
  "data/fetchRawMaterialGroups",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI(
        "/api/row-material-groups?populate=*",
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchUserList = createAsyncThunk(
  "data/fetchUserList",
  async (token, thunkAPI) => {
    try {
      return await fetchDataFromAPI("/api/custom/users", token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ✅ Redux slice to manage state
const fetchDataSlice = createSlice({
  name: "data",
  initialState: {
    designGroups: [],
    colorCategories: [],
    availableCustomers: [],
    availableDesignMaster: [],
    availableDesignMasterGroups: [],
    availableUnits: [],
    availableSfgmGroups: [],
    availableRawMaterialGroups: [],
    userList: [],
    availableProcessor: [],
    load: false,
    error: null,
  },
  reducers: {}, // No synchronous reducers needed
  extraReducers: (builder) => {
    builder
      // Fetch Design Groups
      .addCase(fetchDesignGroups.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchDesignGroups.fulfilled, (state, action) => {
        state.load = false;
        state.designGroups = action.payload;
      })
      .addCase(fetchDesignGroups.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch design groups";
      })

      // Fetch Color
      .addCase(fetchColor.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchColor.fulfilled, (state, action) => {
        state.load = false;
        state.colorCategories = action.payload;
      })
      .addCase(fetchColor.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch color";
      })

      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.load = false;
        state.availableCustomers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch customers";
      })

      // Fetch DesignMasters
      .addCase(fetchDesignMasters.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchDesignMasters.fulfilled, (state, action) => {
        state.load = false;
        state.availableDesignMaster = action.payload;
      })
      .addCase(fetchDesignMasters.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch designMasters";
      })

      // Fetch DesignMasterGroups
      .addCase(fetchDesignMasterGroups.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchDesignMasterGroups.fulfilled, (state, action) => {
        state.load = false;
        state.availableDesignMasterGroups = action.payload;
      })
      .addCase(fetchDesignMasterGroups.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch designMasterGroups";
      })

      // Fetch Units
      .addCase(fetchUnits.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.load = false;
        state.availableUnits = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch units";
      })

      // Fetch SfgmGroups
      .addCase(fetchSfgmGroups.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchSfgmGroups.fulfilled, (state, action) => {
        state.load = false;
        state.availableSfgmGroups = action.payload;
      })
      .addCase(fetchSfgmGroups.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch sfgmGroups";
      })

      // Fetch RawMaterialGroups
      .addCase(fetchRawMaterialGroups.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchRawMaterialGroups.fulfilled, (state, action) => {
        state.load = false;
        state.availableRawMaterialGroups = action.payload;
      })
      .addCase(fetchRawMaterialGroups.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch rawMaterialGroups";
      })

      //Fetch User list
      .addCase(fetchUserList.pending, (state) => {
        state.load = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.load = false;
        state.userList = action.payload;
        const data = action.payload;
        if (data && Array.isArray(data) && data.length > 0) {
          const filterData = data.filter(
            (item) => item.designation !== "Admin"
          );
          state.availableProcessor = filterData;
        }
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.load = false;
        state.error = action.payload || "Failed to fetch userList";
      });
  },
});

export default fetchDataSlice.reducer; // ✅ Corrected slice name
