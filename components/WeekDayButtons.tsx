import { Button, Col, Row } from "react-bootstrap";
import { DateStatusList, WeekDay } from "../interfaces/DateStatus";

type WeekDayButtonsProps = {
  dateStatusList: DateStatusList;
  setDateStatusList: (list: DateStatusList) => void;
};

export const WeekDayButtons = ({
  dateStatusList,
  setDateStatusList,
}: WeekDayButtonsProps): JSX.Element => {
  const weekDays: { id: WeekDay; label: string }[] = [
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

  const weekDayIdToVariant = (
    weekDayId: WeekDay
  ): "accent" | "main" | "secondary" => {
    const status = dateStatusList[weekDayId];
    if (status == "calendar-free") {
      return "accent";
    } else if (status == "calendar-busy") {
      return "main";
    } else {
      return "secondary";
    }
  };

  const updateDateStatusList = async (weekDay: WeekDay) => {
    const status = dateStatusList[weekDay];

    if (status == null) {
      dateStatusList[weekDay] = "calendar-free";
      setDateStatusList({ ...dateStatusList });
    } else if (status == "calendar-free") {
      dateStatusList[weekDay] = "calendar-busy";
      setDateStatusList({ ...dateStatusList });
    } else {
      delete dateStatusList[weekDay];
      setDateStatusList({ ...dateStatusList });
    }
  };

  return (
    <Row>
      {weekDays.map((weekDay) => {
        return (
          <Col key={weekDay.id} className="p-1">
            <Button
              variant={weekDayIdToVariant(weekDay.id)}
              onClick={() => {
                updateDateStatusList(weekDay.id);
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
