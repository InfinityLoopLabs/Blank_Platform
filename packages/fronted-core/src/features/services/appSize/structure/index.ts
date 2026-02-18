export const initialState = {
  isMobile: false,
  isTablet: false,
  isHorizontal: false,
  screenFlags: {
    isSM: false,
    isMD: false,
    isLG: false,
    isXL: false,
    is2XL: false,
  },
  appSize: {
    innerWidth: null as number | null,
    innerHeight: null as number | null,
    clientWidth: null as number | null,
    clientHeight: null as number | null,
  },
}
