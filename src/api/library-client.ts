import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { BookDto, BookResponseDto } from "./dto/book.dto";
import { LoanDto, LoanResponseDto } from "./dto/loan.dto";

export type ClientResponse<T> = {
  success: boolean;
  data: T;
  statusCode: number;
};

export class LibraryClient {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:8081",
    });

    this.client.interceptors.request.use(
      (config) => {
        config.headers = config.headers || {};

        const token = localStorage.getItem("jwtToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access - redirecting to login");
        }
        return Promise.reject(error);
      },
    );
  }

  public async login(data: LoginDto): Promise<{
    role: string | undefined;
    data: LoginResponseDto | undefined;
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<LoginResponseDto> = await this.client.post(
        "/auth/login",
        data,
      );

      // zapisanie tokena w localStorage
      localStorage.setItem("jwtToken", `${response.data.token}`);

      return {
        success: true,
        data: response.data,
        role: response.data.role,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        role: undefined,
        data: undefined,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getBooks(): Promise<ClientResponse<any | null>> {
    try {
      const response = await this.client.get("/book/getAll");

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getLoans(
    page: number = 0,
    size: number = 10,
  ): Promise<ClientResponse<any>> {
    try {
      const response = await this.client.get("/loan/getAll", {
        params: { page, size },
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addBook(data: BookDto): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<BookResponseDto> = await this.client.post(
        "/book/add",
        data,
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addUser(data: {
    password: string;
    role: string;
    username: string;
    email: string;
  }): Promise<{
    success: boolean;
    statusCode: number;
  }> {
    try {
      const response: AxiosResponse<BookResponseDto> = await this.client.post(
        "/auth/register",
        data,
      );

      return {
        success: true,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addLoan(
    data: LoanDto,
  ): Promise<ClientResponse<LoanResponseDto | null>> {
    try {
      const response = await this.client.post("/loan/add", data);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }
}
