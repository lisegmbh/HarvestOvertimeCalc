import { PublicHoliday } from "@app/models/publicHoliday.model";

export interface HolidayApiResponse {
    status: number,
    holidays: PublicHoliday[]
}