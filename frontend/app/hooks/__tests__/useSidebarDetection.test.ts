import { renderHook } from '@testing-library/react';
import { useSidebarDetection } from '@/app/hooks/useSidebarDetection';
import { useMobileDetection, MobileState } from '@/app/hooks/useMobileDetection';
import { mobileStateIsMediumOrSmaller } from '@/app/hooks/useMobileDetection';

jest.mock('@/app/hooks/useMobileDetection', () => ({
  useMobileDetection: jest.fn(),
  mobileStateIsMediumOrSmaller: jest.fn(),
}));

const mockUseMobileDetection = useMobileDetection as jest.MockedFunction<typeof useMobileDetection>;
const mockMobileStateIsMediumOrSmaller = mobileStateIsMediumOrSmaller as jest.MockedFunction<typeof mobileStateIsMediumOrSmaller>;

describe('useSidebarDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when mobile state is not medium or smaller', () => {
    mockUseMobileDetection.mockReturnValue('large' as MobileState);
    mockMobileStateIsMediumOrSmaller.mockReturnValue(false);

    const { result } = renderHook(() => useSidebarDetection());

    expect(result.current).toBe(true);
    expect(mockUseMobileDetection).toHaveBeenCalled();
    expect(mockMobileStateIsMediumOrSmaller).toHaveBeenCalledWith('large');
  });

  it('returns false when mobile state is medium or smaller', () => {
    mockUseMobileDetection.mockReturnValue('medium' as MobileState);
    mockMobileStateIsMediumOrSmaller.mockReturnValue(true);

    const { result } = renderHook(() => useSidebarDetection());

    expect(result.current).toBe(false);
    expect(mockUseMobileDetection).toHaveBeenCalled();
    expect(mockMobileStateIsMediumOrSmaller).toHaveBeenCalledWith('medium');
  });

  it('updates when mobile state changes', () => {
    mockUseMobileDetection
      .mockReturnValueOnce('large' as MobileState)
      .mockReturnValueOnce('small' as MobileState);
    mockMobileStateIsMediumOrSmaller
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const { result, rerender } = renderHook(() => useSidebarDetection());

    expect(result.current).toBe(true);

    rerender();

    expect(result.current).toBe(false);
  });

  it('handles different mobile states correctly', () => {
    const testCases = [
      { mobileState: 'xsmall', isMediumOrSmaller: true, expected: false },
      { mobileState: 'small', isMediumOrSmaller: true, expected: false },
      { mobileState: 'medium', isMediumOrSmaller: true, expected: false },
      { mobileState: 'large', isMediumOrSmaller: false, expected: true },
      { mobileState: 'xlarge', isMediumOrSmaller: false, expected: true },
    ];

    testCases.forEach(({ mobileState, isMediumOrSmaller, expected }) => {
      mockUseMobileDetection.mockReturnValue(mobileState as MobileState);
      mockMobileStateIsMediumOrSmaller.mockReturnValue(isMediumOrSmaller);

      const { result } = renderHook(() => useSidebarDetection());

      expect(result.current).toBe(expected);
      expect(mockMobileStateIsMediumOrSmaller).toHaveBeenCalledWith(mobileState);
    });
  });
});
