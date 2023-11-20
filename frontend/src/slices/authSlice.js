import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USERS_URL } from "../constants";


// Async thunk action to login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post( `${USERS_URL}/auth`, { email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk action to logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${USERS_URL}/logout`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk action to register
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, phoneNumber }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${USERS_URL}`, {
        name,
        email,
        password,
        phoneNumber
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk action to update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ name, email, password, phoneNumber }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${USERS_URL}/profile`, {
        name,
        email,
        password,
        phoneNumber
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
)

// Async thunk action to fetch all users
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${USERS_URL}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
)

// Async thunk action to delete a user
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${USERS_URL}/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
)

// Async thunk action to fetch user by ID
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${USERS_URL}/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk action to update user by ID
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, name, email, phoneNumber, isAdmin }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${USERS_URL}/${id}`, {
        name,
        email,
        phoneNumber,
        isAdmin,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  status: "idle",
  users: [],
  usersStatus: 'idle',
  deleteUserStatus: 'idle',
  deleteError: null,
  error: null,
  user: null,
  userStatus: 'idle',
  userError: null,
  updatedUserStatus: 'idle',
  updatedError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.userInfo = null;
        localStorage.clear()
      })
      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersStatus = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.error = action.payload.message;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleteUserStatus = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUserStatus = "succeeded";
        // Remove the deleted user from the users array
        state.users = state.users.filter(user => user._id !== action.meta.arg);
        state.deleteError = null; // Clear any delete error
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserStatus = "failed";
        state.deleteError = action.payload.message;
      })
      // fetch single user
      .addCase(fetchUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.user = action.payload;
        state.userError = null; // Clear any fetchUser error
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userStatus = "failed";
        state.userError = action.payload.message;
      })
      // update user
      .addCase(updateUser.pending, (state) => {
        state.updatedUserStatus = "loading";
        console.log("loading");
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updatedUserStatus = "succeeded";
        state.user = action.payload; // Update the user in the state
        state.updatedError = null; // Clear any update error
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updatedUserStatus = "failed";
        state.updatedError = action.payload.message;
      })
  },
});

export default authSlice.reducer;
