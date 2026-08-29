export interface UserDto {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly roles?: readonly string[];
}
