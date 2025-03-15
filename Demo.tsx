import React, { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Container,
  Grid,
} from '@mui/material';

const Dashboard = () => {
  // Initial widget layout, retrieved from localStorage or default values
  const initialLayout = JSON.parse(localStorage.getItem('dashboardLayout')) || [
    { i: '1', x: 0, y: 0, w: 2, h: 2, minW: 1, minH: 1, maxW: 4, maxH: 4 },
    { i: '2', x: 2, y: 0, w: 2, h: 2, minW: 1, minH: 1, maxW: 4, maxH: 4 },
    { i: '3', x: 4, y: 0, w: 2, h: 2, minW: 1, minH: 1, maxW: 4, maxH: 4 },
    { i: '4', x: 6, y: 0, w: 2, h: 2, minW: 1, minH: 1, maxW: 4, maxH: 4 },
  ];

  const [layout, setLayout] = useState(initialLayout);
  const [selectedWidget, setSelectedWidget] = useState(null);

  // Persist layout updates to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
  }, [layout]);

  /**
   * Updates widget properties while respecting min/max constraints.
   */
  const updateWidgetProperty = (property, value) => {
    if (!selectedWidget) return;

    setLayout((prevLayout) =>
      prevLayout.map((item) =>
        item.i === selectedWidget
          ? {
              ...item,
              [property]: value,
              w: Math.max(item.minW, Math.min(item.maxW, item.w)),
              h: Math.max(item.minH, Math.min(item.maxH, item.h)),
            }
          : item
      )
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: 2,
        background: '#ddd',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 2 }}
      >
        Accessible Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ flexGrow: 1, height: '100%' }}>
        {/* Left Panel - Widget List & Settings */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            background: '#f4f4f4',
            padding: 2,
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6">List of widgets</Typography>
          <List role="listbox" aria-label="Widget list">
            {layout.map((item) => (
              <ListItem key={item.i} disablePadding>
                <ListItemButton
                  selected={selectedWidget === item.i}
                  onClick={() => setSelectedWidget(item.i)}
                >
                  Widget {item.i}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {selectedWidget && (
            <>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Widget Settings
              </Typography>
              <Grid container spacing={2}>
                {['x', 'y', 'w', 'minW', 'maxW', 'h', 'minH', 'maxH'].map(
                  (prop, index) => (
                    <Grid item xs={index % 3 === 0 ? 6 : 3} key={prop}>
                      <TextField
                        label={prop.toUpperCase()}
                        type="number"
                        fullWidth
                        value={
                          layout.find((item) => item.i === selectedWidget)?.[
                            prop
                          ] || 0
                        }
                        onChange={(e) =>
                          updateWidgetProperty(
                            prop,
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </>
          )}
        </Grid>
        {/* Main Panel - Widgets */}
        <Grid
          item
          xs={12}
          md={9}
          sx={{ padding: 2, height: '100%', overflowY: 'auto' }}
        >
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={50}
            width={1200}
            isDraggable
            isResizable
            compactType={null}
            preventCollision
          >
            {layout.map((item) => (
              <div key={item.i} data-id={item.i}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">Widget {item.i}</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </GridLayout>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
