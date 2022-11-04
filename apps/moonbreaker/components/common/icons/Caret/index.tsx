interface Props {
  direction: 'up' | 'down';
  fill: string;
}

const Caret = ({ direction, fill }: Props) => (
  <svg
    width="27"
    height="24"
    viewBox="0 0 27 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {direction === 'up' ? (
      <>
        <path
          d="M12.2071 0.753402L0.199104 21.5593C0.0686686 21.7852 0 22.0415 0 22.3023C0 22.5632 0.0686686 22.8195 0.199104 23.0454C0.330039 23.2722 0.518576 23.4604 0.745624 23.5908C0.972672 23.7213 1.23017 23.7895 1.49204 23.7885L25.508 23.7885C25.7698 23.7895 26.0273 23.7213 26.2544 23.5908C26.4814 23.4604 26.67 23.2722 26.8009 23.0454C26.9313 22.8195 27 22.5632 27 22.3023C27 22.0415 26.9313 21.7852 26.8009 21.5593L14.7929 0.753402C14.6633 0.524689 14.4754 0.334451 14.2482 0.202097C14.0211 0.0697427 13.7629 7.39953e-06 13.5 7.39953e-06C13.2371 7.39953e-06 12.9789 0.0697427 12.7518 0.202097C12.5246 0.334451 12.3367 0.524689 12.2071 0.753402V0.753402ZM22.9369 20.8162L4.06305 20.8162L13.5 4.46874L22.9369 20.8162Z"
          fill={fill}
        />
        <path
          d="M13.8228 2.14342L25.3942 21.4291L2.25137 21.4291L13.8228 2.14342Z"
          fill={fill}
          stroke={fill}
        />
      </>
    ) : (
      <>
        <path
          d="M14.7929 23.7487L26.8009 2.94287C26.9313 2.71695 27 2.46068 27 2.19981C27 1.93894 26.9313 1.68266 26.8009 1.45674C26.67 1.22995 26.4814 1.04178 26.2544 0.911295C26.0273 0.780807 25.7698 0.712634 25.508 0.713673L1.49204 0.713673C1.23017 0.712634 0.972672 0.780807 0.745624 0.911295C0.518576 1.04178 0.33004 1.22995 0.199105 1.45674C0.06867 1.68266 3.57628e-07 1.93894 3.57628e-07 2.19981C3.57628e-07 2.46068 0.06867 2.71695 0.199105 2.94287L12.2071 23.7487C12.3367 23.9775 12.5246 24.1677 12.7518 24.3C12.9789 24.4324 13.2371 24.5021 13.5 24.5021C13.7629 24.5021 14.0211 24.4324 14.2482 24.3C14.4754 24.1677 14.6633 23.9775 14.7929 23.7487ZM4.06305 3.68594L22.9369 3.68594L13.5 20.0334L4.06305 3.68594Z"
          fill={fill}
        />
        <path
          d="M13.1772 22.3587L1.60577 3.07301L24.7486 3.07301L13.1772 22.3587Z"
          fill={fill}
        />
      </>
    )}
  </svg>
);

export default Caret;