import '../assets/style/alertPopup.scss';

interface AlertButton {
  text: string;
  onClick?: () => void;
  variant?: 'info' | 'warning' | 'error' | 'success';
  className?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}

interface AlertPopupOptions {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClose?: () => void;
}

const alertPopup = (options: AlertPopupOptions): Promise<string> => {
  return new Promise((resolve) => {
    const { title, message, buttons, icon, iconPosition, className, onClose } = options;

    // Create the mask element
    const maskElement = document.createElement('div');
    maskElement.className = 'mask show';
    maskElement.addEventListener('click', () => closeAlertPopup());

    // Create the alert popup element
    const alertPopupElement = document.createElement('div');
    alertPopupElement.className = `alert-popup ${className || ''}`;

    // Create the title element
    if (title) {
      const titleElement = document.createElement('h2');
      titleElement.textContent = title;
      alertPopupElement.appendChild(titleElement);
    }

    // Create the icon element
    if (icon) {
      const iconElement = document.createElement('i');
      iconElement.className = `alert-popup-icon ${icon} ${iconPosition || 'left'}`;
      if (title) {
        const titleContainer = alertPopupElement.querySelector('h2');
        if (titleContainer) {
          titleContainer.insertAdjacentElement(iconPosition === 'left' ? 'afterbegin' : 'beforeend', iconElement);
        }
      } else {
        alertPopupElement.appendChild(iconElement);
      }
    }
    // Create the message element
    if (message) {
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      alertPopupElement.appendChild(messageElement);
    }



    // Create the buttons
    if (buttons && buttons.length > 0) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'alert-popup-buttons';

      buttons.forEach((button) => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.text;
        buttonElement.className = `alert-popup-button ${button.variant || ''} ${button.className || ''}`;
        buttonElement.disabled = button.disabled || false;

        buttonElement.addEventListener('click', () => {
          if (button.onClick) {
            button.onClick();
          }
          resolve(button.text); // Resolve the promise with the button text
          closeAlertPopup();
        });

        buttonContainer.appendChild(buttonElement);
      });

      alertPopupElement.appendChild(buttonContainer);
    }

    // Append the mask and alert popup to the body
    document.body.appendChild(maskElement);
    document.body.appendChild(alertPopupElement);

    // Close function
    const closeAlertPopup = () => {
      if (onClose) onClose();
      document.body.removeChild(maskElement);
      document.body.removeChild(alertPopupElement);
    };
  });
};

export const DeleteConfirmationPopup = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    alertPopup({
      title: 'Delete Confirmation',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          variant: 'warning',
          onClick: () => {
            resolve(false);
          },
        },
        {
          text: 'Delete',
          variant: 'error',
          onClick: () => {
            resolve(true);
          },
        },
      ],
      icon: 'pi pi-trash',
      iconPosition: 'left',
      className: 'delete-confirmation-popup',
      onClose: () => {
        resolve(false);
      },
    });
  });
};

export default alertPopup;