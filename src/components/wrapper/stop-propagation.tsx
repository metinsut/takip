type Props = {
  children: React.ReactNode;
  className?: string;
};

export function StopPropagation(props: Props) {
  const { children, className } = props;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div onClick={handleClick} onKeyDown={handleKeyDown} role="application" className={className}>
      {children}
    </div>
  );
}
