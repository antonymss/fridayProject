import {getRandomCard} from "./get-random-card";

it('random card is returned successfully', () => {
    let cards = [{
        _id: "001", question: "what?", answer: "nothing", grade: 2, answerImg: "0",
        cardsPack_id: "60abf4517efa6100041db9bc", comments: "", created: new Date(),
        questionImg: "data:image/png;base64,/9j/4AAQSkZJRg", rating: 0, shots: 0, type: "card",
        updated: new Date(), user_id: "608fda0af07a130004b5c500"
    },
        {
            _id: "002", question: "who?", answer: "her", grade: 5, answerImg: "0",
            cardsPack_id: "60abf4517efa6100041db9bc", comments: "", created: new Date(),
            questionImg: "data:image/png;base64,/005", rating: 0, shots: 0, type: "card",
            updated: new Date(), user_id: "608fda0af07a130004b5c500"
        }]

    let randomCard = getRandomCard(cards)

    expect(randomCard).toBeDefined()
    expect(randomCard._id).toBeDefined()
    expect(randomCard.question).toBeDefined()
})

it(`an available card is returned successfully if the initial array has 1 card only`, () => {
    let arrayWithOneCard = [{
        _id: "003", question: "where?", answer: "there", grade: 1, answerImg: "0",
        cardsPack_id: "60abf4517565696", comments: "", created: new Date(),
        questionImg: "data:i76535", rating: 0, shots: 0, type: "card",
        updated: new Date(), user_id: "608fda02753"
    }]

    let randomCard = getRandomCard(arrayWithOneCard)

    expect(randomCard.question).toBe("where?")
    expect(randomCard.grade).toBe(1)
    expect(randomCard.user_id).toBe("608fda02753")
})