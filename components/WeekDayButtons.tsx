import { Button, Col, Overlay, Row, Tooltip } from "react-bootstrap";
import { Status, DateStatusList } from "../interfaces/DateStatus";

interface WeekDayButtonsProps {
  dateStatusList: DateStatusList;
  setDateStatusList: (list: DateStatusList) => void;
}

export const WeekDayButtons = ({
  dateStatusList,
  setDateStatusList,
}: WeekDayButtonsProps): JSX.Element => {
  const weekDays = [
    {
      id: "mon",
      label: "月",
    },
    {
      id: "tue",
      label: "火",
    },
    {
      id: "wed",
      label: "水",
    },
    {
      id: "thu",
      label: "木",
    },
    {
      id: "fri",
      label: "金",
    },
    {
      id: "sat",
      label: "土",
    },
    {
      id: "sun",
      label: "日",
    },
  ];

  return (
    <Row>
      {weekDays.map((weekDay) => {
        return (
          <Col key={weekDay.id} className="p-1">
            <Button
              variant="secondary"
              onClick={() => {
                console.log(weekDay.id);
              }}
            >
              {weekDay.label}
            </Button>
          </Col>
        );
      })}
    </Row>
  );
};
