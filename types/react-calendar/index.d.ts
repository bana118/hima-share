// TODO @types/react-calendar が更新されていないので対症療法. @types/react-calendarが更新されたら更新する
// inputRefについてのIssue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52547
import { CalendarProps } from "../../node_modules/@types/react-calendar/";

export default function Calendar(props: MyCalendarProps): JSX.Element;

export interface MyCalendarProps extends CalendarProps {
  inputRef?: React.RefObject<JSX.Element>;
}
