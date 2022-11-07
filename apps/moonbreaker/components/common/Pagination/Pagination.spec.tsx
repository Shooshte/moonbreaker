import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Pagination from './index';

interface TestCase {
  props: {
    activePage: number;
    pageCount: number;
  };
  buttonInteractions: {
    buttonText: string;
    expectedNewPage: number | null;
  }[];
  renderedButtonsTexts: string[];
}

const TEST_CASES: TestCase[] = [
  {
    props: {
      activePage: 1,
      pageCount: 2,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: null },
      { buttonText: '1', expectedNewPage: null },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '>', expectedNewPage: 2 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '>'],
  },
  {
    props: {
      activePage: 2,
      pageCount: 2,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 1 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: null },
      { buttonText: '>', expectedNewPage: null },
    ],
    renderedButtonsTexts: ['<', '1', '2', '>'],
  },
  {
    props: {
      activePage: 1,
      pageCount: 3,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: null },
      { buttonText: '1', expectedNewPage: null },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '>', expectedNewPage: 2 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '>'],
  },
  {
    props: {
      activePage: 2,
      pageCount: 3,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 1 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '>', expectedNewPage: 3 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '>'],
  },
  {
    props: {
      activePage: 3,
      pageCount: 3,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 2 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: null },
      { buttonText: '>', expectedNewPage: null },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '>'],
  },
  {
    props: {
      activePage: 1,
      pageCount: 4,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: null },
      { buttonText: '1', expectedNewPage: null },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '>', expectedNewPage: 2 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '4', '>'],
  },
  {
    props: {
      activePage: 2,
      pageCount: 4,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 1 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '>', expectedNewPage: 3 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '4', '>'],
  },
  {
    props: {
      activePage: 3,
      pageCount: 4,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 2 },
      { buttonText: '>', expectedNewPage: 4 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: null },
      { buttonText: '4', expectedNewPage: 4 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '4', '>'],
  },
  {
    props: {
      activePage: 4,
      pageCount: 4,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 3 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '4', expectedNewPage: null },
      { buttonText: '>', expectedNewPage: null },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '4', '>'],
  },
  {
    props: {
      activePage: 1,
      pageCount: 5,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: null },
      { buttonText: '1', expectedNewPage: null },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '5', expectedNewPage: 5 },
      { buttonText: '>', expectedNewPage: 2 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '...', '5', '>'],
  },
  {
    props: {
      activePage: 2,
      pageCount: 5,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 1 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '5', expectedNewPage: 5 },
      { buttonText: '>', expectedNewPage: 3 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '...', '5', '>'],
  },
  {
    props: {
      activePage: 3,
      pageCount: 5,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 2 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: null },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '5', expectedNewPage: 5 },
      { buttonText: '>', expectedNewPage: 4 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '4', '5', '>'],
  },
  {
    props: {
      activePage: 4,
      pageCount: 5,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 3 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '4', expectedNewPage: null },
      { buttonText: '5', expectedNewPage: 5 },
      { buttonText: '>', expectedNewPage: 5 },
    ],
    renderedButtonsTexts: ['<', '1', '...', '3', '4', '5', '>'],
  },
  {
    props: {
      activePage: 5,
      pageCount: 5,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 4 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '5', expectedNewPage: null },
      { buttonText: '>', expectedNewPage: null },
    ],
    renderedButtonsTexts: ['<', '1', '...', '3', '4', '5', '>'],
  },
  {
    props: {
      activePage: 1,
      pageCount: 6,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: null },
      { buttonText: '1', expectedNewPage: null },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '6', expectedNewPage: 6 },
      { buttonText: '>', expectedNewPage: 2 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '...', '6', '>'],
  },
  {
    props: {
      activePage: 2,
      pageCount: 6,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 1 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '6', expectedNewPage: 6 },
      { buttonText: '>', expectedNewPage: 3 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '...', '6', '>'],
  },
  {
    props: {
      activePage: 3,
      pageCount: 6,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 2 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '2', expectedNewPage: 2 },
      { buttonText: '3', expectedNewPage: null },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '6', expectedNewPage: 6 },
      { buttonText: '>', expectedNewPage: 4 },
    ],
    renderedButtonsTexts: ['<', '1', '2', '3', '4', '...', '6', '>'],
  },
  {
    props: {
      activePage: 4,
      pageCount: 6,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 3 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '3', expectedNewPage: 3 },
      { buttonText: '4', expectedNewPage: null },
      { buttonText: '5', expectedNewPage: 5 },
      { buttonText: '6', expectedNewPage: 6 },
      { buttonText: '>', expectedNewPage: 5 },
    ],
    renderedButtonsTexts: ['<', '1', '...', '3', '4', '5', '6', '>'],
  },
  {
    props: {
      activePage: 5,
      pageCount: 6,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 4 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '5', expectedNewPage: null },
      { buttonText: '6', expectedNewPage: 6 },
      { buttonText: '>', expectedNewPage: 6 },
    ],
    renderedButtonsTexts: ['<', '1', '...', '4', '5', '6', '>'],
  },
  {
    props: {
      activePage: 6,
      pageCount: 6,
    },
    buttonInteractions: [
      { buttonText: '<', expectedNewPage: 5 },
      { buttonText: '1', expectedNewPage: 1 },
      { buttonText: '...', expectedNewPage: null },
      { buttonText: '4', expectedNewPage: 4 },
      { buttonText: '5', expectedNewPage: 5 },
      { buttonText: '6', expectedNewPage: null },
      { buttonText: '>', expectedNewPage: null },
    ],
    renderedButtonsTexts: ['<', '1', '...', '4', '5', '6', '>'],
  },
];

describe('Pagination', () => {
  TEST_CASES.forEach((testCase) => {
    describe(`pageCount: ${testCase.props.pageCount}, activePage: ${testCase.props.activePage} `, () => {
      it('renders the correct buttons', () => {
        render(
          <Pagination
            activePage={testCase.props.activePage}
            onPageChange={(newPage: number) => {
              return newPage;
            }}
            pageCount={testCase.props.pageCount}
          />
        );

        const renderedButtons = screen.getAllByRole('button');

        testCase.renderedButtonsTexts.forEach((buttonText, index) => {
          expect(renderedButtons[index].textContent).toEqual(buttonText);
        });

        cleanup();
      });

      it('handles button interactions correctly', () => {
        testCase.buttonInteractions.forEach(
          ({ buttonText, expectedNewPage }) => {
            const mockOnPageChange = jest.fn();

            render(
              <Pagination
                activePage={testCase.props.activePage}
                onPageChange={mockOnPageChange}
                pageCount={testCase.props.pageCount}
              />
            );

            fireEvent.click(screen.getByRole('button', { name: buttonText }));

            if (expectedNewPage) {
              expect(mockOnPageChange.mock.calls.length).toBe(1);
              expect(mockOnPageChange).toHaveBeenCalledWith(expectedNewPage);
            } else {
              expect(mockOnPageChange.mock.calls.length).toBe(0);
              expect(mockOnPageChange).not.toHaveBeenCalled();
            }

            cleanup();
          }
        );
      });
    });
  });
});

export {};
