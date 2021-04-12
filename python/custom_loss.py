import tensorflow as tf 

def filtered_mae(GLOBAL_BATCH_SIZE):
  def my_step(x):
    return tf.divide(1.0, 
                    tf.add(1.0, tf.exp(tf.multiply(-1000.0, 
                                                   tf.subtract(x, 0.02)))))
  def filtered_mae_loss(y_true, y_pred):
    # we can hardcode denominator as 10 since we know that there will always be 10 relevent values
    # in this case I just multiply by 0.1 for simplicity  
    loss = tf.multiply(0.1, tf.reduce_sum(tf.multiply(my_step(y_true), 
                                          tf.abs(tf.subtract(y_pred, y_true)))))
    loss_per_batch = tf.divide(loss, GLOBAL_BATCH_SIZE)
    return loss_per_batch
  return filtered_mae_loss
