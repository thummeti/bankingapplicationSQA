import axios from "axios";

const HOST = "http://localhost:4000";

export function makePayment(data) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/transfer`,
        data: data,
    })
}

export function makeWithdraw(data) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/withdraw`,
        data: data,
    })
}

export function makeDeposit(data) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/deposit`,
        data: data,
    })
}

export function getTransactions() {
    return axios({
        method: "get",
        withCredentials: true,
        url: `${HOST}/transactions`,
    })
}


// Create a new card
// Object should contain cardType, creditLimit (if credit card), and any other relevant data
export const createCard = async (cardData) => {
    try {
        const response = await axios.post(`${HOST}/cards`, cardData, {withCredentials: true,});
        return response.data;
    } catch (error) {
        // Handle errors (e.g., show an error message to the user)
        console.error('There was an error creating the card:', error.response);
        throw error;
    }
};

// Delete a card
// No object needed, just the ID of the card to be deleted
export const deleteCard = async (cardId) => {
    try {
        const response = await axios.delete(`${HOST}/cards/${cardId}`, {withCredentials: true,});
        return response.data;
    } catch (error) {
        console.error('There was an error deleting the card:', error.response);
        throw error;
    }
};

// Transfer money to a card
// Object should contain cardId and amount to be transferred
export const transferToCard = async (transferData) => {
    try {
        const response = await axios.post(`${HOST}/transfer-to-card`,
            transferData,
            {withCredentials: true,}
        );
        return response.data;
    } catch (error) {
        console.error('There was an error transferring money to the card:', error.response);
        throw error;
    }
};


export function getCards() {
    return axios({
        method: "get",
        withCredentials: true,
        url: `${HOST}/cards`,
    });
}

export function getAllCards() {
    return axios({
        method: "get",
        withCredentials: true,
        url: `${HOST}/allCards`,
    });
}


export function disableCard(cardId) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/cards/disable/${cardId}`,
    });
}
export function enableCard(cardId) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/cards/approve/${cardId}`,
    });
}
export function getAllUsers() {
    return axios({
        method: "get",
        withCredentials: true,
        url: `${HOST}/allUsers`,
    });
}


export function enableUser(accountId) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/account/enable/${accountId}`,
    });
}
export function disableUser(accountId) {
    return axios({
        method: "post",
        withCredentials: true,
        url: `${HOST}/account/disable/${accountId}`,
    });
}



