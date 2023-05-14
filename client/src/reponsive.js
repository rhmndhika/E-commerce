import { css } from 'styled-components'

export const mobile = (props) => {
    return css`
      @media only screen and (max-width: 380px) {
        ${props}
      }
    `;
};


export const isMobile = (props) => {
    return css`
      @media only screen and (max-width: 565px) {
        ${props}
      }
    `;
};

export const isMobile490 = (props) => {
  return css`
    @media only screen and (max-width: 490px) {
      ${props}
    }
  `;
};

export const isMobile620 = (props) => {
  return css`
    @media only screen and (max-width: 620px) {
      ${props}
    }
  `;
};



export const isTablet = (props) => {
  return css`
    @media only screen and (max-width: 704px) {
      ${props}
    }
  `;
};

export const isTablet730 = (props) => {
  return css`
    @media only screen and (max-width: 730px) {
      ${props}
    }
  `;
};

export const isTablet860 = (props) => {
  return css`
    @media only screen and (max-width: 860px) {
      ${props}
    }
  `;
};



