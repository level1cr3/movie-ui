export type ApiError = {
  title: string;
  detail: string;
  status: number;
  type: string;
  instance: string;
  method: string;
  errors: {
    code: string;
    message: string;
    propertyName: string | null;
  }[];
};
