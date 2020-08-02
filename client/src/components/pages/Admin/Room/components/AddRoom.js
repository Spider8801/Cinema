import React, { useState } from "react";
import { withStyles, Button, Typography, TextField, MenuItem, Box } from "@material-ui/core";
import styles from "./styles";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { getCinemas } from "../../../../../store/cinema/cinema.thunk";
import Matrix from "../../Movie/components/Matrix";

const AddRoom = (props) => {
   const { classes, className, loading, selectedRoom, getCinemas, cinemas } = props;
   const rootClassName = classNames(classes.root, className);
   const [room, setRoom] = useState({
      name: "",
      structure: "",
      cinema: "",
      seats: "",
      maxRow: "",
      maxCol: ""
   });
   const [message, setMessage] = useState({
      name: "",
      cinema: "",
      seats: ""
   });

   React.useEffect(() => {
      if (selectedRoom) {
         setRoom({
            ...room,
            name: selectedRoom.name,
            seats: selectedRoom.seats,
            cinema: selectedRoom.cinema,
            structure: selectedRoom.structure
         });
      }
      getCinemas();
      //eslint-disable-next-line
   }, []);

   const isValid = (message.cinema !== "" || message.name !== "" || message.seats !== "");

   const showErrors = (e, error) => setMessage({ ...message, [e.target.name]: error });

   const onChange = (e) => {
      setRoom({ ...room, [e.target.name]: e.target.value });
      if (e.target.name === "name"
         && e.target.value.length > 0
         && (e.target.value.length < 10 || e.target.value.length > 200)) {
         showErrors(e, "Room Name must be greater than 10 characters and less than 200 characters.");
      } else {
         showErrors(e, "");
      }
   };

   const onSeatsChange = (e) => {
      setRoom({ ...room, [e.target.name]: e.target.value });
      if (isNaN(e.target.value)) {
         showErrors(e, "Seats must be Numeric.");
      } else {
         showErrors(e, "");
      }
   };

   const onAddRoom = (e) => {
      e.preventDefault();
      // const { name, address, city, image, star } = cinema;
      //       // saveCinema({
      //       //    name, address, city, image, star
      //       // });
   };

   const onUpdateRoom = (e, id) => {
      e.preventDefault();
      // const { name, address, city, image, star } = cinema;
      // updateCinema(
      //    id,
      //    {
      //       name, address, city, image, star
      //    }
      // );
   };

   const setStructure = () => {
      let structure = [];
      for (let i = 0; i < room.maxRow; ++i) {
         let seats = [];
         for (let j = 0; j < room.maxCol; ++j) {
            seats.push(0);
         }
         structure.push(seats);
      }
      console.log(room.maxRow, room.maxCol);
      return structure;
   };

   const title = selectedRoom ? "Edit Room" : "Add Room";
   const submitButton = selectedRoom ? "Update Room" : "Add Room";
   const submitAction = selectedRoom
      ? (e) => onUpdateRoom(e, selectedRoom.id)
      : (e) => onAddRoom(e);

   return (
      <div className={rootClassName}>
         {loading && (
            <Grid container justify={"center"} alignItems={"center"}>
               <CircularProgress color="secondary"/>
            </Grid>
         )}
         <Typography variant="h4" className={classes.title}>
            {title}
         </Typography>
         <form onSubmit={submitAction}>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Room Name"
                  margin="dense"
                  name="name"
                  required
                  value={room.name}
                  onChange={onChange}
                  error={message.name !== ""}
                  helperText={message.name || "Please specify the Room Name"}
                  variant="outlined"
                  rowsMax={1}
                  inputProps={{
                     minLength: 10,
                     maxLength: 200
                  }}
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Seats"
                  margin="dense"
                  name="seats"
                  value={room.seats}
                  variant="outlined"
                  onChange={onSeatsChange}
                  error={message.seats !== ""}
                  helperText={message.seats}
                  rowsMax={1}
                  inputProps={{
                     type: "number"
                  }}
                  required
               />
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  select
                  className={classes.textField}
                  value={room.cinema}
                  onChange={e => setRoom({ ...room, cinema: e.target.value })}
                  label="Cinema"
                  required
                  variant="outlined">
                  {cinemas.map((cinema, index) => (
                     <MenuItem key={cinema.id + "-" + index} value={cinema.id}>
                        {cinema.name}
                     </MenuItem>
                  ))}
               </TextField>
            </div>
            <div className={classes.field}>
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Max Row"
                  margin="dense"
                  value={room.maxRow}
                  variant="outlined"
                  onChange={e => setRoom({ ...room, maxRow: e.target.value })}
                  rowsMax={1}
                  inputProps={{
                     type: "number"
                  }}
                  required
               />
               <TextField
                  fullWidth
                  className={classes.textField}
                  label="Max Column"
                  margin="dense"
                  value={room.maxCol}
                  variant="outlined"
                  onChange={e => setRoom({ ...room, maxCol: e.target.value })}
                  rowsMax={1}
                  inputProps={{
                     type: "number"
                  }}
                  required
               />
            </div>
            {room.maxRow && room.maxCol && (
               <>
                  <div className={classes.field}>
                     <div style={{ display: "flex" }}>
                        <div style={{ margin: "0 10px" }}>0.NO SEAT</div>
                        <div style={{ margin: "0 10px" }}>1.NORMAL</div>
                        <div style={{ margin: "0 10px" }}>2.VIP</div>
                        <div style={{ margin: "0 10px" }}>3.WAY</div>
                        <div style={{ margin: "0 10px" }}>6.COUPLE</div>
                     </div>
                  </div>
                  {room.maxRow && room.maxCol && (
                     <div className={classes.field}>
                        <Matrix
                           columns={setStructure()}
                           resize={"both"}
                           readonly={false}
                        />
                     </div>
                  )}
               </>
            )}
            <Button
               className={classes.buttonFooter}
               color="primary"
               type="submit"
               variant="contained"
               disabled={isValid || loading}>
               {submitButton}
            </Button>
         </form>
      </div>
   );
};

const mapStateToProps = state => ({
   loading: state.cinemaState.loading,
   cinemas: state.cinemaState.cinemas
});

const mapDispatchToProps = {
   getCinemas
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddRoom));