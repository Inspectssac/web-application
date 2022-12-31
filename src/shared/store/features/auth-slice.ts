import { LoginData } from '@/iam/models/interfaces/login.interface'
import { UserStorage } from '@/iam/models/interfaces/user-storage.interface'
import { User } from '@/iam/models/user.model'
import { AuthServices } from '@/iam/services/auth.service'
import { createAsyncThunk, createSlice, SliceCaseReducers } from '@reduxjs/toolkit'

interface AUTH_STORE {
  user: UserStorage | null
  authenticated: boolean
  error: string | null | undefined
}

const getInitialState = (): AUTH_STORE => {
  const userJson = localStorage.getItem('user')
  if (!userJson) {
    return {
      user: null,
      authenticated: false,
      error: null
    }
  }

  return {
    user: JSON.parse(userJson),
    authenticated: true,
    error: null
  }
}

const INITIAL_STATE: AUTH_STORE = getInitialState()

export const login = createAsyncThunk('login', async (loginData: LoginData): Promise<UserStorage | null> => {
  const authService = new AuthServices()
  return await authService.login(loginData)
})

export const register = createAsyncThunk('register', async () => {

})

const authSlice = createSlice<AUTH_STORE, SliceCaseReducers<AUTH_STORE>>({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    logout: (state, action) => {
      const authService = new AuthServices()
      console.log('logout')
      authService.logout()
    }
  },
  extraReducers (builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.authenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message
      })
      // .addCase(register.pending, (state, action) => {
      //   state.status = AUTH_STATUS.LOADING
      // })
      // .addCase(register.fulfilled, (state, action) => {
      //   state.status = AUTH_STATUS.SUCCEEDED
      // })
      // .addCase(register.rejected, (state, action) => {
      //   state.status = AUTH_STATUS.FAILED
      //   state.error = action.error.message
      // })
  }
})

export const { logout } = authSlice.actions

export const getCurrentUser = (state: any): User | null => state.auth.user
export const isAuthenticated = (state: any): boolean => state.auth.authenticated

export default authSlice.reducer
