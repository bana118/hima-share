// TODO @types/react-calendar が更新されていないので対症療法. @types/react-calendarが更新されたら不要になる
// inputRefについてのIssue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52547
// formatDayについてのPR https://github.com/DefinitelyTyped/DefinitelyTyped/pull/52556
import {
  CalendarProps,
  FormatterCallback,
} from "../../node_modules/@types/react-calendar/";

export default function Calendar(props: MyCalendarProps): JSX.Element;

export interface MyCalendarProps extends CalendarProps {
  inputRef?: React.RefObject<JSX.Element>;
  formatDay?: FormatterCallback;
}
