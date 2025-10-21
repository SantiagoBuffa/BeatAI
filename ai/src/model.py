import numpy as np
import pandas as pd
import tensorflow as tf
import gym
from gym import spaces
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, LSTM, Dense, Dropout, Flatten
import matplotlib.pyplot as plt