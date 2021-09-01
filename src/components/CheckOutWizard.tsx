import { Step, StepLabel, Stepper } from '@material-ui/core';
import React, { FC } from 'react';
import { useStyles } from '../styles/styles';

type CheckOutWizard = {
  activeStep: number;
};

export const CheckOutWizard: FC<CheckOutWizard> = ({ activeStep = 0 }) => {
  const { transparentBackground } = useStyles();

  return (
    <Stepper
      className={transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ),
      )}
    </Stepper>
  );
};
