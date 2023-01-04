import { Card } from "antd";
import styled from "styled-components";

export const WrapperCard = styled(Card)`
    width: 200px;
    & img {
        height: 200px;
        width: 200px
    }
    position:relative;
`

export const NameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
`;

export const WrapperReportText = styled.div`
  font-size: 10px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  margin: 6px 0 0px;
`;

export const WrapperPriceText = styled.div`
  text-align: left;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  margin: 8px 0;
  color: rgb(255, 66, 38);
  display: flex;
  align-items: center;
`;

export const WrapperDiscountText = styled.div`
  padding: 0px 2px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 4px;
  color: rgb(255, 66, 78);
`;
