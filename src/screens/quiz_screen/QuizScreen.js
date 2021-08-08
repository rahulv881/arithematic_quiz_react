import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Quiz from '../../components/Quiz';


export default function QuizScreen() {

    const [firstQuizCompleted, setFirstQuizCompleted] = useState(false);
    const [secondQuizCompleted, setSecondQuizCompleted] = useState(false);
    const [score1,setScore1] = useState(0);
    const [score2,setScore2] = useState(0);

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser = (e) => {
        e.preventDefault();
        const message =
            "Are you sure you want to leave? All provided data will be lost.";
        e.returnValue = message;
        return message;

    }

    return (
        <Grid container style={{ padding: "32px",height:"90vh"}} spacing={2} >
            <Grid item xs={12}>
                <Typography variant="h4" >Arithematic Quiz</Typography>
                <Typography variant="body2" align="left">Note: Please enter answer upto 2 decimal precision in case of division</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Quiz quizSubmitted={firstQuizCompleted} setQuizSubmitted={setFirstQuizCompleted} setQuizScore={setScore1} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Quiz quizSubmitted={secondQuizCompleted} setQuizSubmitted={setSecondQuizCompleted} setQuizScore={setScore2} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" >
                    {
                        (firstQuizCompleted && secondQuizCompleted ) ? 
                            "Total Score: "+(parseInt(score1)+parseInt(score2))
                        : "Attempt all question to submit the quiz and get a score"
                    }
                </Typography>
            </Grid>
        </Grid>
    );

}