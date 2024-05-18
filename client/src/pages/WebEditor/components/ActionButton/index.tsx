import styles from "./ActionButton.module.scss";
import clsx from "clsx";
import { IconType } from "react-icons";

interface ActionButtonProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>> {
  className?: string,
  IconComponent?: IconType;
  isActive?: boolean;
  isDisable?: boolean;
}
const ActionButton: React.FC<ActionButtonProps> = ({
  className,
  children,
  IconComponent,
  isActive = false,
  isDisable = false,
  ...p
}) => {
  return (
    <button
      {...p}
      disabled={isDisable}
      className={clsx([
        styles.actionButton,
        className,
        {
          [styles.actionButtonActive]: isActive,
          [styles.actionButtonDisable]: isDisable,
        },
      ])}
    >
      {IconComponent && (
        <IconComponent
          width={100}
          className={clsx([
            styles.actionIcon,
            {
              [styles.actionIconActive]: isActive,
              [styles.actionIconDisable]: isDisable,
            },
          ])}
        />
      )}
      {children}
    </button>
  );
};

export default ActionButton;
