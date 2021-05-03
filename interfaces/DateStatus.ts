export type Status = "calendar-free" | "calendar-busy";

export type DateStatus = {
  date: Date;
  status: Status;
};
