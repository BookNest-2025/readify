document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const modal = document.getElementById('paymentModal');
    const openBtn = document.getElementById('openPaymentModalBtn');
    const closeBtn = document.querySelector('.close-button');

    // Get payment option elements
    const paymentOptions = document.querySelectorAll('input[name="payment_method"]');
    const topupMessage = document.getElementById('topup-message');
    const finalPayBtn = document.getElementById('final-pay-btn');

    // Function to open the modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event listeners to open and close the modal
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal if user clicks on the overlay
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Function to update the footer based on selection
    const updatePaymentFooter = () => {
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;

        if (selectedMethod === 'points') {
            topupMessage.style.display = 'flex'; // Show the top-up message
            finalPayBtn.textContent = 'TOPUP AND PAY';
        } else {
            topupMessage.style.display = 'none'; // Hide the top-up message
            finalPayBtn.textContent = 'PAY Rs. 1,099';
        }
    };

    // Add event listener to each payment option
    paymentOptions.forEach(option => {
        option.addEventListener('change', updatePaymentFooter);
    });

    // Initial check when the modal loads
    updatePaymentFooter();
});