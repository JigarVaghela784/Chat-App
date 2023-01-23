import { Badge as BaseBadge} from "antd";
const Badge = (props) => {
  const { personType } = props;
  return <BaseBadge status={personType} />;
};

export default Badge;
