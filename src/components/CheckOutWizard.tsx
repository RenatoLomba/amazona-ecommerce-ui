import { Step, StepLabel, Stepper } from '@material-ui/core';
import React, { FC } from 'react';

type CheckOutWizard = {
  activeStep: number;
};

export const CheckOutWizard: FC<CheckOutWizard> = ({ activeStep = 0 }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
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
