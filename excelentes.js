const cart = [];

function showMessage(messageText, backgroundColor = '#4CAF50', textColor = 'white') {
    // Cria o elemento da mensagem
    const message = document.createElement('div');
    message.textContent = messageText;
    message.style.position = 'fixed';
    message.style.top = '10px';
    message.style.right = '20px';
    message.style.backgroundColor = backgroundColor;
    message.style.color = textColor;
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
    message.style.fontSize = '24px';
    message.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    message.style.opacity = '0';
    message.style.transition = 'opacity 0.5s ease, top 0.5s ease';
    message.style.zIndex = '1000';

    // Adiciona a mensagem ao body
    document.body.appendChild(message);

    // Mostra a mensagem com animação
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.top = '10%';
    }, 10);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.top = '10%';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 500);
    }, 3000);
}


function addToCart(itemName, itemPrice) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        cart[itemIndex].quantity++;
        cart[itemIndex].totalPrice = cart[itemIndex].quantity * itemPrice;
    } else {
        cart.push({ name: itemName, quantity: 1, price: itemPrice, totalPrice: itemPrice });
    }
    showMessage('Adicionado com sucesso!', '#121212', 'white');
    updateCart();

}

function removeFromCart(itemName) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
    }
    showMessage('Item removido!', '#F44336', 'white');


    updateCart();
}

function changeQuantity(itemName, change) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].totalPrice = cart[itemIndex].quantity * cart[itemIndex].price;
        }
    }
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.totalPrice;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            ${item.quantity}x ${item.name} - R$${item.totalPrice.toFixed(2).replace('.', ',')}
            <button onclick="changeQuantity('${item.name}', -1)">-</button>
            <button onclick="changeQuantity('${item.name}', 1)">+</button>
            <button onclick="removeFromCart('${item.name}')">Remover</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
    const cartTotal = document.getElementById('cart-total');
    cartTotal.textContent = `Total: R$${total.toFixed(2).replace('.', ',')}`;
}

function toggleChangeField() {
    const paymentMethod = document.getElementById('payment-method').value;
    const changeField = document.getElementById('change-field');
    if (paymentMethod === 'dinheiro') {
        changeField.style.display = 'block';
    } else {
        changeField.style.display = 'none';
    }
}

function submitOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const number = document.getElementById('number').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const cep = document.getElementById('cep').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const change = document.getElementById('change').value;
    const observations = document.getElementById('observations').value; // Pega as observações

    if (!name || !address || !number || !neighborhood || !cep || !paymentMethod) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    let orderSummary = `
*Nome:* ${name}\n
*Endereço:* ${address}, ${number}, ${neighborhood} - *CEP:* ${cep}\n
*Forma de pagamento:* ${paymentMethod}\n
`;

    // Inclui a chave Pix se o método de pagamento for Pix
    if (paymentMethod === 'pix') {
        orderSummary += `*Chave Pix:* Pix Celular: (11)917902466\n`;
    }

    if (paymentMethod === 'dinheiro' && change) {
        orderSummary += `Troco para: R$${change}\n`;
    }

    orderSummary += "\nItens do pedido:\n";
    let total = 0; // Inicialize o total

    // Adiciona os itens do carrinho ao resumo do pedido e calcula o total
    cart.forEach(item => {
        orderSummary += `${item.quantity}x ${item.name} - R$${item.totalPrice.toFixed(2).replace('.', ',')}\n`;
        total += item.totalPrice; // Adiciona o preço total de cada item
    });

    orderSummary += `\n*Total:* R$${total.toFixed(2).replace('.', ',')}\n`; // Adiciona o total do pedido

    // Adiciona as observações se existirem
    if (observations) {
        orderSummary += `\n*Observações:* ${observations}\n`;
    }

    const whatsappMessage = encodeURIComponent(orderSummary);
    const whatsappUrl = `https://wa.me/5511968559541?text=${whatsappMessage}`; // Substitua pelo número do WhatsApp
    window.open(whatsappUrl, '_blank');
    showMessage('Pedido enviado com sucesso!', '#121212', 'white');
    cart.length = 0;
    updateCart();
}
