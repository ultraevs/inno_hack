import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendAnswer, sendMessage } from "./actions";

interface IInitialState {
  messages: IMessage[];
  lastMessage: IMessage | null;
  secretValue: string;
}

export interface IMessage {
  text: string;
  buttons?: boolean;
  secret?: string;
}

const initialState: IInitialState = {
  messages: [],
  lastMessage: null,
  secretValue: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<IMessage>) => {
          state.messages.push(action.payload);

          const secretValue = action.payload.secret
            ? action.payload.secret
            : "";
          if (secretValue !== "") {
            state.secretValue = secretValue;
          }
        },
      )
      .addCase(
        sendAnswer.fulfilled,
        (state, action: PayloadAction<IMessage>) => {
          state.messages.push(action.payload);
        },
      );
  },
});

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;
