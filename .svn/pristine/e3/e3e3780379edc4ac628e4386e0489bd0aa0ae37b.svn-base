import { message } from 'antd';

export interface MessageType extends PromiseLike<any> {
  (): void;
}

export interface MessageInstance {
  info(
    content: React.ReactNode,
    duration?: number | (() => void),
    onClose?: () => void,
  ): MessageType;
  success(
    content: React.ReactNode,
    duration?: number | (() => void),
    onClose?: () => void,
  ): MessageType;
  error(
    content: React.ReactNode,
    duration?: number | (() => void),
    onClose?: () => void,
  ): MessageType;
  warning(
    content: React.ReactNode,
    duration?: number | (() => void),
    onClose?: () => void,
  ): MessageType;
  loading(
    content: React.ReactNode,
    duration?: number | (() => void),
    onClose?: () => void,
  ): MessageType;
}

export default {
  info: (content: React.ReactNode, duration?: number | (() => void), onClose?: () => void) => {
    return message.info(content, duration, onClose);
  },
  error: (content: React.ReactNode, duration?: number | (() => void), onClose?: () => void) => {
    return message.error(content, duration, onClose);
  },
  success: (content: React.ReactNode, duration?: number | (() => void), onClose?: () => void) => {
    return message.success(content, duration, onClose);
  },
  warning: (content: React.ReactNode, duration?: number | (() => void), onClose?: () => void) => {
    return message.warning(content, duration, onClose);
  },
  loading: (content: React.ReactNode, duration?: number | (() => void), onClose?: () => void) => {
    return message.warning(content, duration, onClose);
  },
} as MessageInstance;
