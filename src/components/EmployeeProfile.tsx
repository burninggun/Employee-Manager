import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { drawerWidth } from '../App'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

const getEmployee = gql`
    query getEmployee($id: ID!) {
        getEmployee(id: $id) {
            createdAt
            firstname
            lastname
            id
            skills {
                items {
                    skill {
                        name
                    }
                }
            }
        }
    }
`

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    avatar: {
        height: '150px',
        width: '150px',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10%'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skill: {
        backgroundColor: theme.palette.secondary.light,
        margin: theme.spacing(2),
        borderRadius: '10%'

    }

}))



type DashboardProps = {
    drawerOpen: boolean
}
const EmployeePlaceholder = {
    firstname: '?',
    lastname: '?',
    id: '',
    skills: {
        items: []
    }
}


const EmployeeProfile = ({ drawerOpen }: DashboardProps) => {
    const classes = useStyles()
    const { id } = useParams() as { id: string }
    const { data, loading } = useQuery(getEmployee, {
        variables: { id }
    })
    const [employee, setEmployee] = useState<any>(EmployeePlaceholder)
    useEffect(() => {
        if (!loading) {
            setEmployee(data.getEmployee)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    const skillMap = employee.skills.items.map((skill: any, index: number) => {
        return (
            <Grid item className={classes.skill} key={index} >
                <Typography >
                    {skill.skill.name}
                </Typography>
            </Grid>
        )
    })
    let initials = employee.firstname[0].toUpperCase() + employee.lastname[0].toUpperCase()

    return (
        <div
            className={clsx(classes.content, {
                [classes.contentShift]: drawerOpen,
            })}
        >
            <div className={classes.drawerHeader} />
            <Paper>
                <Grid container>
                    <Grid item xs={6}>
                        <div className={classes.avatar} >
                            <Typography variant='h1'>{initials}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6} className={classes.center} >
                        <Typography> Employee Since: {employee.createdAt}</Typography>
                    </Grid>
                    <Typography variant="h6">
                        {employee.firstname} {employee.lastname}
                    </Typography>

                    <Grid container spacing={3} alignItems="center" >
                        <Typography variant="body1">Skills:</Typography>

                        {skillMap}

                    </Grid>
                </Grid>

            </Paper>


        </div>
    )
}

export default EmployeeProfile