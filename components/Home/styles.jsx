import styled from 'styled-components';
import { COLOR, MEDIA_QUERY } from 'util/theme';

export const HomeContainer = styled.div``;

// common styles for each tab
export const MiddleContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  margin: 1rem auto 0 auto;
  border: 1px solid ${COLOR.BORDER_GREY};
  padding: 1.25rem;
  border-radius: 5px;
  font-size: 16px;
  .gnosis-logo {
  }

  ${MEDIA_QUERY.tablet} {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const BoxContainer = styled.div`
  max-width: 340px;
  margin: auto;
`;

export const Sections = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  .section {
    .info {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      .balance {
        font-size: 34px;
        line-height: normal;
      }
    }
  }

  ${MEDIA_QUERY.tablet} {
    flex-direction: column;
  }
`;

export const SectionHeader = styled.h2`
  font-weight: normal;
`;

export const SectionFooter = styled.div`
  line-height: normal;
  margin-top: 1.25rem;
  color: ${COLOR.GREY_2};
`;
