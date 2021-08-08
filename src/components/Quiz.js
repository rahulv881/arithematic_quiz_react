import React, { useState } from 'react'
import { Grid } from '@material-ui/core';
import { Typography, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import CustomButton from './CustomButton'
import { OPERATORS } from '../utils/constants';
import { getAnswer, generateRandomNumbers } from '../utils/utility';

const useStyle = makeStyles({
    container: {
        width: "100%",
        minHeight: "600px",
        overflow: "scroll"
    },
    resultItem: {
        margin: "16px",
        align: "left",
        borderRadius: "4px",
        padding: "16px 8px"
    }
})

export default function Quiz({ quizSubmitted, setQuizSubmitted, setQuizScore }) {

    const classes = useStyle();
    const [answer, setAnswer] = useState("");
    const [submitQuiz, setSubmitQuiz] = useState(false)
    // get stored questions if exists else intialize questions as empty array.
    const [questions, setQuestions] = useState([]);

    // 1 based indexing for current question number in questions array.
    const [currQuesNumber, setCurrQuesNumber] = useState(0);
    const [startQuiz, setStartQuiz] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [errMsg, setErrMsg] = useState("");
    const [attemptedQuestions, setAttemptedQuestions] = useState(0);
    const totalQuestions = 10;

    const validate = (answer) => {
        return isNaN(parseInt(answer)) ? false : true;
    }
    const setNextQues = () => {
        // Sequence of events.
        // 1. Save previous question answer.
        // 2. Generate next questions.
        // generate new question if current current == attempted question
        if (currQuesNumber == attemptedQuestions + 1) {

            // 0. Validate given answer before moving to next question
            if (!validate(answer)) {
                setErrMsg("Please enter valid number");
                return;
            }
            else {
                setErrMsg("");
            }

            let updatedQuestions = questions;
            let currScore = 0;
            // 1. Update last question answer.
            if (currQuesNumber > 0) {
                const lastQuestion = questions[currQuesNumber - 1];
                const [x, OPERATOR, y] = lastQuestion.q.split(' ');

                currScore = getAnswer(parseInt(x), parseInt(y), OPERATOR) == answer ? 1 : 0;
                updatedQuestions[currQuesNumber - 1] = {
                    ...lastQuestion,
                    input: answer,
                    score
                }
            }
            setAttemptedQuestions(() => attemptedQuestions + 1);
            setCurrQuesNumber(() => currQuesNumber + 1);
            setScore(() => score + currScore);
            // 2. Generate next question.
            const { x, y, index } = generateRandomNumbers(setX, setY, setIndex);



            const question = {
                q: x + " " + OPERATORS[index] + " " + y,
                input: "",
                score: 0
            };
            updatedQuestions = [...questions, question];
            setQuestions(updatedQuestions);
            setAnswer("");
        }
        else {
            // else show stored question answer result to user.
            setAnswer(questions[currQuesNumber].input);
            setCurrQuesNumber(() => currQuesNumber + 1);
        }
    }

    const onStartClick = () => {
        const { x, y, index } = generateRandomNumbers(setX, setY, setIndex);




        const questions = [{
            q: x + " " + OPERATORS[index] + " " + y,
            input: "",
            score: 0
        }];
        setQuestions(questions);
        setCurrQuesNumber(currQuesNumber + 1);
        setAnswer("");

        setStartQuiz(true);
    }

    const onPreviousClick = () => {
        // -1 for matching 0 based indexing and -1 againg for accessing previous question
        setAnswer(questions[currQuesNumber - 2].input);
        setCurrQuesNumber(() => currQuesNumber - 1);
    }

    const onNextClick = () => {
        setNextQues();
    }

    const onSubmit = () => {
        // 0. Validate given answer before moving to next question
        if (!validate(answer)) {
            setErrMsg("Please enter valid number");
            return;
        }
        else {
            setErrMsg("");
        }

        // 1. Update last question answer.
        let updatedQuestions = questions;
        let currScore = 0;
        if (currQuesNumber > 0) {
            const lastQuestion = questions[currQuesNumber - 1];
            const [x, OPERATOR, y] = lastQuestion.q.split(' ');

            currScore = getAnswer(parseInt(x), parseInt(y), OPERATOR) == answer ? 1 : 0;
            updatedQuestions[currQuesNumber - 1] = {
                ...lastQuestion,
                input: answer,
                score
            }
        }
        setAttemptedQuestions(() => attemptedQuestions + 1);

        // 2. Show evaluated result.
        setQuizScore(score);
        setQuizSubmitted(true);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (currQuesNumber < totalQuestions)
            onNextClick();
        else
            onSubmit();
    };

    const startQuizButton = (
        <CustomButton text={"Start quiz"} handleClick={onStartClick} />
    );

    const quiz = (
        <Grid container >
            <Grid item xs={12}>
                <Typography align="left">Question: {currQuesNumber}</Typography>
            </Grid>
            <Grid item xs={12} align="left" >
                <Typography >
                    Evaluate: {currQuesNumber - 1 >= 0 ? questions[currQuesNumber - 1].q : null}
                </Typography>
                <form onSubmit={handleFormSubmit}>
                    <TextField
                        id="textfield"
                        value={answer}
                        error={errMsg.length ? true : false}
                        helperText={errMsg.length ? errMsg : null}
                        variant="outlined"
                        placeholder="Enter your answer..."
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={currQuesNumber - 1 < attemptedQuestions}
                    />
                </form>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: "32px" }}>
                <CustomButton
                    text="Prevous"
                    lockButton={currQuesNumber == 1}
                    handleClick={onPreviousClick}
                />
                <CustomButton
                    text="Next"
                    lockButton={currQuesNumber == totalQuestions}
                    handleClick={onNextClick}
                />
                <CustomButton
                    text="Submit quiz"
                    handleClick={onSubmit}
                    lockButton={currQuesNumber < totalQuestions}
                />
            </Grid>
            <Grid item xs={12} align="right">
                <Typography variant="body1">Score: {score}</Typography>
            </Grid>
        </Grid>
    );

    if (quizSubmitted == true) {
        return <Paper elevation={2} spacing={2} className={classes.container}>
            {
                questions.map((question, index) => {
                    const [x, OPERATOR, y] = question.q.split(' ');
                    const answer = getAnswer(x, y, OPERATOR);

                    return (<div className={classes.resultItem} style={{ border: `1px solid ${answer == question.input ? "green" : "red"}` }}>
                        <Typography align="left" style={{ color: answer == question.input ? "green" : "red" }} >Problem {index + 1}:  {question.q}</Typography>
                        <Typography align="left" style={{ color: answer == question.input ? "green" : "red" }}>Your Answer:  {question.input}</Typography>
                        <Typography align="left" style={{ color: answer == question.input ? "green" : "red" }}>Expected : {answer}</Typography>
                    </div>)
                })
            }
        </Paper>;
    }
    return (
        <Paper elevation={2} spacing={2} style={{ padding: "32px", height: "80hv", overflow: "scroll" }}>
            {
                startQuiz == false ?
                    startQuizButton :
                    quiz
            }
        </Paper>
    );
}